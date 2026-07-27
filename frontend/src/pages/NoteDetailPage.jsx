import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { Loader2, Save, Trash2 } from "lucide-react";
import NoteEditor from "../components/NoteEditor";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [initialData, setInitialData] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Fetch the note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        const { title, content } = res.data;

        setFormData({ title, content });
        setInitialData({ title, content });
      } catch (error) {
        console.error(error);

        if (error.response?.status === 429) {
          toast.error("Too many requests. Please try again later.");
        } else if (error.response?.status === 404) {
          toast.error("Note not found.");
        } else {
          toast.error("Failed to load note.");
        }

        navigate("/");
      } finally {
        setFetching(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const hasChanges = () => {
    return (
      formData.title !== initialData.title ||
      formData.content !== initialData.content
    );
  };

  const handleCancel = () => {
    if (hasChanges()) {
      const confirmLeave = window.confirm("Discard your unsaved changes?");

      if (!confirmLeave) return;
    }

    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      setLoading(true);

      await api.put(`/notes/${id}`, formData);

      toast.success("Note updated successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Failed to update note.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      setDeleting(true);

      await api.delete(`/notes/${id}`);

      toast.success("Note deleted successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Failed to delete note.");
      }
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={36} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <NoteEditor
      showHeading={false}
      formData={formData}
      setFormData={setFormData}
      isDirty={hasChanges()}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitText="Save"
      submitLoadingText="Saving..."
      submitIcon={Save}
      headerActions={
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn btn-sm sm:btn-md btn-ghost gap-2 border border-base-content/10 hover:border-error/30 text-base-content/70 hover:bg-error/10 hover:text-error"
        >
          {deleting ? (
            <>
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Delete
            </>
          )}
        </button>
      }
    />
  );
};

export default NoteDetailPage;
