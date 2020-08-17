async function getComment() {
  try {
    const { data } = await axios.get("/comments");
    const ul = document.getElementById("comments");
    ul.innerHTML = "";
    Object.keys(data).map((key) => {
      const li = document.createElement("li");
      li.classList.add("comment");
      li.textContent = data[key];
      const edit = document.createElement("button");
      edit.textContent = "Edit";
      edit.classList.add("edit-button");
      edit.addEventListener("click", async () => {
        const newComment = prompt("Enter new commnet");
        if (!newComment) {
          newComment = prompt("Must enter new commnet");
        }
        try {
          await axios.put("/comment/" + key, { comment: newComment });
          getComment();
        } catch (err) {
          console.error(err);
        }
      });
      const remove = document.createElement("button");
      remove.textContent = "X";
      remove.classList.add("delete-button");
      remove.addEventListener("click", async () => {
        try {
          await axios.delete("/comment/" + key);
          getComment();
        } catch (err) {
          console.error(err);
        }
      });
      li.appendChild(edit);
      li.appendChild(remove);
      ul.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}
window.onload = getComment;

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const comment = e.target.commentInput.value;
  console.log(comment);
  if (!comment) {
    return alert("Enter Comment");
  }
  try {
    await axios.post("/comment", { comment });
    getComment();
  } catch (err) {
    console.error(err);
  }
  e.target.commentInput.value = "";
});
