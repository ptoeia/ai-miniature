"use client";

import {
  Chrome,
  Mail,
  Loader2,
  LucideProps,
} from 'lucide-react';

export const Icons = {
  Google: (props: LucideProps) => <Chrome {...props} />,
  Email: (props: LucideProps) => <Mail {...props} />,
  Spinner: (props: LucideProps) => <Loader2 {...props} className="animate-spin" />,
};

export default Icons;
