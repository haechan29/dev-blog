export interface WritePostForm {
  title: string;
  tags: string[];
  password: string;
  content: string;
}

const validator = {
  title: (form: WritePostForm) => form.title.trim().length > 0,
  tags: (form: WritePostForm) => true,
  password: (form: WritePostForm) => form.password.trim().length > 0,
  content: (form: WritePostForm) => form.content.trim().length > 0,
};

export function validate(
  form: WritePostForm,
  ...fields: (keyof WritePostForm)[]
) {
  return fields.every(field => validator[field](form));
}
