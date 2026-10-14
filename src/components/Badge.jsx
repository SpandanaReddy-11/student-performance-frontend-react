const CLASSES = { 'On track': 'ok', 'Needs attention': 'attn', 'At risk': 'risk' };

export default function Badge({ status }) {
  return <span className={'badge ' + (CLASSES[status] || 'none')}>{status}</span>;
}
