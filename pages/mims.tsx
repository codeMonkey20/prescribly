import InputSuggest from "@/components/InputSuggest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

type Props = {};

export default function MimsPage({}: Props) {
  const router = useRouter()
  return (
    <div>
      <Button onClick={() => router.push("/")}>BACK</Button>
    </div>
  );
}
