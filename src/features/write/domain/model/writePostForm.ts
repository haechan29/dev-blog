export interface WritePostForm {
  invalidField: string | null;
  title: {
    value: string;
    isUserInput: boolean;
    isEmptyAllowed: boolean;
    maxLength: number;
  };
  tags: {
    value: string[];
    isUserInput: boolean;
    isEmptyAllowed: boolean;
    maxTagLength: number;
    maxTagsLength: number;
    delimiter: string;
  };
  password: {
    value: string;
    isEmptyAllowed: boolean;
    maxLength: number;
  };
  content: {
    value: string;
    isUserInput: boolean;
    isEmptyAllowed: boolean;
    maxLength: number;
  };
}

export function validate(form: WritePostForm, ...fields: string[]) {
  return fields.every(field => {
    switch (field) {
      case 'title': {
        const { value, isEmptyAllowed, maxLength } = form[field];
        return (
          (isEmptyAllowed || value.length > 0) && value.length <= maxLength
        );
      }
      case 'tags': {
        const { value, isEmptyAllowed, maxTagsLength } = form[field];
        return (
          (isEmptyAllowed || value.length > 0) && value.length <= maxTagsLength
        );
      }
      case 'password': {
        const { value, isEmptyAllowed, maxLength } = form[field];
        return (
          (isEmptyAllowed || value.length > 0) && value.length <= maxLength
        );
      }
      case 'content': {
        const { value, isEmptyAllowed, maxLength } = form[field];
        return (
          (isEmptyAllowed || value.length > 0) && value.length <= maxLength
        );
      }
      default:
        return false;
    }
  });
}
