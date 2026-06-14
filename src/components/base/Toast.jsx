export default function Toast({ toast }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const bg = isSuccess ? 'bg-[#2D5F3F]' : 'bg-red-500';
  const icon = isSuccess ? 'ri-check-line' : 'ri-error-warning-line';

  return (
    <div className="fixed top-4 right-4 z-[100] animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg ${bg}`}>
        <div className="w-5 h-5 flex items-center justify-center">
          <i className={icon}></i>
        </div>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}