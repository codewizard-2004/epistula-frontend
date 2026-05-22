import { useMutation } from "@tanstack/react-query";

interface ParseDocumentInput {
  file: File;
  jobDescription: string;
}

export const useParseDocument = () => {
  return useMutation({
    mutationFn: async ({ file, jobDescription }: ParseDocumentInput) => {
      const formData = new FormData();
      formData.append("resume_file", file);
      formData.append("job_description", jobDescription);

      const response = await fetch("http://localhost:8000/api/parse/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse document");
      }

      return response.json();
    },
  });
};
