import { parseFragment, type DefaultTreeAdapterMap } from 'parse5';
import { japanese } from './ja';

type Node = DefaultTreeAdapterMap['node'];
type TextNode = DefaultTreeAdapterMap['textNode'];

const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const JAPANESE = /[　-ヿ一-鿿＀-￯]/;
const isEmphasis = (node?: Node) =>
  !!node && 'tagName' in node &&
  (['em', 'strong'].includes(node.tagName) || node.attrs.some(({ name, value }) => name === 'class' && /\b(spoiler|accent)\b/.test(value)));
const plainText = (node: Node): string =>
  'value' in node ? japanese(node.value).trim() : 'childNodes' in node ? node.childNodes.map(plainText).join('') : '';

// 일본어는 띄어 쓰지 않는다. 강조 요소와 일본어 문구가 맞닿는 자리의 공백은 원문의 띄어쓰기이므로 없앤다.
function spacing(node: TextNode, translated: string) {
  const siblings = node.parentNode?.childNodes ?? [];
  const index = siblings.indexOf(node);
  const previous = siblings[index - 1];
  const next = siblings[index + 1];
  if (!translated) {
    const joined = isEmphasis(previous) && isEmphasis(next) && JAPANESE.test(plainText(previous).slice(-1)) && JAPANESE.test(plainText(next).charAt(0));
    return { leading: joined ? '' : node.value, trailing: '' };
  }
  return {
    leading: isEmphasis(previous) && JAPANESE.test(translated.charAt(0)) ? '' : node.value.match(/^\s*/)?.[0] ?? '',
    trailing: isEmphasis(next) && JAPANESE.test(translated.slice(-1)) ? '' : node.value.match(/\s*$/)?.[0] ?? '',
  };
}

// 원본 HTML의 위치 정보로 표시 문구만 치환하고 ID·스크립트·링크는 보존한다.
export function japaneseMarkup(html: string): string {
  const document = parseFragment(html, { sourceCodeLocationInfo: true });
  const replacements: { start: number; end: number; value: string }[] = [];
  const missing = new Set<string>();
  const translate = (value: string) => {
    const result = japanese(value);
    if (result === value && /[가-힣]/.test(value)) missing.add(value.trim());
    return result;
  };
  const attributes = new Set(['aria-label', 'title', 'alt', 'data-summary']);
  function visit(node: DefaultTreeAdapterMap['node']) {
    if ('tagName' in node) {
      if (['script', 'style'].includes(node.tagName) || node.attrs.some(({ name }) => name === 'data-language-switch')) return;
      for (const attribute of node.attrs) {
        let translated = attribute.value;
        if (attributes.has(attribute.name)) translated = translate(attribute.value);
        if (attribute.name === 'data-viewer') {
          const views = JSON.parse(attribute.value);
          translated = JSON.stringify(views.map((view: { caption: string }) => ({ ...view, caption: translate(view.caption) })));
        }
        const location = node.sourceCodeLocation?.attrs?.[attribute.name];
        if (translated !== attribute.value && location) replacements.push({ start: location.startOffset, end: location.endOffset, value: `${attribute.name}="${escape(translated)}"` });
      }
    }
    if (node.nodeName === '#text' && 'value' in node && node.sourceCodeLocation) {
      const translated = translate(node.value);
      const blank = node.value.trim() === '';
      if (translated !== node.value || blank) {
        const { leading, trailing } = spacing(node, blank ? '' : translated);
        const value = blank ? leading : leading + escape(translated) + trailing;
        if (value !== node.value) replacements.push({ start: node.sourceCodeLocation.startOffset, end: node.sourceCodeLocation.endOffset, value });
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  }
  visit(document);
  if (missing.size) console.warn('[i18n:ja] 번역 누락:', [...missing]);
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    html = html.slice(0, replacement.start) + replacement.value + html.slice(replacement.end);
  }
  return html;
}
