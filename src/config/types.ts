import { type Prisma } from "@prisma/client";

type Params = { [x: string]: string | string[] };

export type PageProps = {
  params?: Promise<Params>;
  searchParams?: Promise<{ [x: string]: string | string[] | undefined }>;
};

export type AwaitedPageProps = {
  params?: Awaited<PageProps["params"]>;
  searchParams?: Awaited<PageProps["searchParams"]>;
};

export type ClassifiedWithImages = Prisma.ClassifiedGetPayload<{
  include: {
    images: true;
  };
}>;

export enum MultiStepForEnum{
  WELCOME = 1,
  SUBMIT_DATE = 2,
  SUBMIT_DETAILS = 3,
}