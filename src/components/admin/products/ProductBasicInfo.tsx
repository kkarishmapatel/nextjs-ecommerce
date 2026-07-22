type Props = {
  loading: boolean;
  slugEdited: boolean;
  setSlugEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProductBasicInfo({
  loading,
  slugEdited,
  setSlugEdited,
}: Props) {
  return (
    <>
      <div>
        <label className="mb-2 block font-medium">
          Product Name
        </label>

        <input
          name="name"
          className="w-full rounded border p-3"
          placeholder="Nike Air Max"
          required
          onChange={(e) => {
            if (!slugEdited) {
              const slugInput = document.querySelector(
                'input[name="slug"]'
              ) as HTMLInputElement;

              slugInput.value = e.target.value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-+|-+$/g, "");
            }
          }}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Slug
        </label>

        <input
          name="slug"
          className="w-full rounded border p-3"
          placeholder="nike-air-max"
          required
          onChange={() => setSlugEdited(true)}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Short Description
        </label>

        <textarea
          name="shortDescription"
          className="w-full rounded border p-3"
          rows={3}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Description
        </label>

        <textarea
          name="description"
          className="w-full rounded border p-3"
          rows={6}
        />
      </div>
    </>
  );
}