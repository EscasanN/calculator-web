export default function Button({ item, onClick }) {
  return (
    <button 
      className={item.type}
      onClick={() => onClick(item)}
    >
      {item.sign}
    </button>
  );
}
