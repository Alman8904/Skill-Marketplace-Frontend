import { authFetch } from "../jwt storage/authFetch";

export default function DeleteUser({ onDelete }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      await authFetch("/public/user/delete", {
        method: "DELETE",
      });

      // tell parent user is gone
      onDelete();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div >
      <button
        onClick={handleDelete}
      >
        Delete Account
      </button>
    </div>
  );
}
