import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import NoteEditor from "../components/NoteEditor";
import ConfirmDialog from "../components/ConfirmDialog";

const CreatePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleCancel = () => {
    const hasUnsavedChanges = formData.title.trim() || formData.content.trim();

    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true);
      return;
    }

    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      setLoading(true);

      await api.post("/notes", formData);

      toast.success("Note created successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Failed to create note.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NoteEditor
        title="Create New Note"
        showHeading={true}
        formData={formData}
        setFormData={setFormData}
        isDirty={Boolean(formData.title.trim() || formData.content.trim())}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Save"
        submitLoadingText="Saving..."
        submitIcon={Save}
      >
        <p>Capture your thoughts before they disappear.</p>
      </NoteEditor>

      {/* Discard Changes Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDiscardConfirm}
        onConfirm={() => {
          setShowDiscardConfirm(false);
          navigate("/");
        }}
        onCancel={() => setShowDiscardConfirm(false)}
        title="Discard Changes?"
        message="You have unsaved changes. If you leave now, your note will be lost."
        confirmText="Discard"
        cancelText="Keep editing"
        variant="warning"
      />
    </>
  );
};

export default CreatePage;

