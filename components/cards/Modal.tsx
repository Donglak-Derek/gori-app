export default function Modal({ children }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">{children}</div>
    </div>
  );
}
