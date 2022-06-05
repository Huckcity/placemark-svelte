<script>
  import { getContext } from "svelte";

  export let params = {};
  const placeId = params.id;
  console.log(placeId);

  const placemarkService = getContext("PlacemarkService");

  const addImage = async () => {
    // @ts-ignore
    const image = document.getElementById("image").files[0];
    const formData = new FormData();
    formData.append("image", image);
    formData.append("placeId", placeId);
    const res = await placemarkService.addImage(formData);
    console.log(res);
    if (res.status === 200) {
      alert("Image added");
    } else {
      alert("Error adding image");
    }
  };
</script>

<form on:submit|preventDefault={addImage} enctype="multipart/form-data">
  <div class="field">
    <label for="image">Image:</label>
    <input type="file" id="image" name="image" />
  </div>
  <button> Add Image </button>
</form>
