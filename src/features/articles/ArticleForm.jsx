import { useState } from "react";
import { addArticle } from "../../firebase/articleServices.js";

function ArticleForm({ refreshArticles }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !link) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addArticle({
        title,
        description,
        link,
      });

      setTitle("");
      setDescription("");
      setLink("");

      refreshArticles();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <button type="submit">
        Add Article
      </button>
    </form>
  );
}

export default ArticleForm;