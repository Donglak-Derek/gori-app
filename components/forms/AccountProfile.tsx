"use client";

import React from "react";

interface Props {
  user: {
    id: string;
    onjectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export default function AccountProfile({ user, btnTitle }: Props) {
  return <div>AccountProfile</div>;
}
