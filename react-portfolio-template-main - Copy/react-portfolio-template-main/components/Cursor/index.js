
// Lightweight fallback Cursor component.
// The project previously used `custom-cursor-react` which requires React 16.
// To avoid peer-dependency conflicts we remove that package and provide
// a minimal no-op component. The app keeps using Tailwind's `cursor-none`
// utility to hide the native cursor when `data.showCursor` is true.
const Cursor = () => {
  return null;
};

export default Cursor;
