import React from "react";
import { useNavigate } from "react-router-dom";
import ReviewCreateForm from "@components/app/ReviewCreateForm";

export default function ReviewNew() {
  const navigate = useNavigate()

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <ReviewCreateForm
          onCreated={(created)=>navigate(`/app/reviews/${created.id}`)}
          submitLabel="添削を依頼"
        />
      </div>
    </div>
  );
}
