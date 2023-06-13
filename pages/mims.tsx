import InputSuggest from "@/components/InputSuggest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { ChangeEvent, useState } from "react";

type Props = {};

export default function MimsPage({}: Props) {
  const [file, setFile] = useState<File>();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleUploadClick = async () => {
    if (!file) {
      return;
    }
    // const res = await axios.post("/api/upload", { file });
    console.log(file);
  };
  return (
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUploadClick}>submit</Button>
    </div>
  );
}
