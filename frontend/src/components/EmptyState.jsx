function EmptyState({ message, icon = '📭' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <span className="text-4xl mb-2">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default EmptyState;