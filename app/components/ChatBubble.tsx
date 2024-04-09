import Image from "next/image";

type ChatBubbleData = {
  owner: boolean;
  name: string;
  image: string;
  createdAt: Date;
  contents: React.ReactNode;
};

export default function ChatBubble({
  owner,
  image,
  contents,
  createdAt,
  name,
}: ChatBubbleData) {
  const dateFormatted = `${createdAt.getFullYear()}-${createdAt.getMonth()}-${createdAt.getDate()} at ${createdAt.getHours()}:${createdAt.getMinutes()}:${createdAt.getSeconds()}`;

  return (
    <div
      data-owner={owner}
      className="flex w-full flex-row items-center gap-3 data-[owner=false]:mr-auto data-[owner=true]:ml-auto data-[owner=true]:flex-row-reverse md:w-8/12 lg:w-7/12 xl:w-6/12"
    >
      <Image
        src={image}
        width={40}
        height={40}
        alt="Profile picture"
        className="rounded-full"
      />
      <div
        data-owner={owner}
        className="relative rounded-md p-3 data-[owner=false]:bg-stone-800 data-[owner=true]:bg-stone-400 data-[owner=true]:text-stone-900 sm:rounded-lg"
      >
        <p className="text-sm">{contents}</p>
        <p
          data-owner={owner}
          className="absolute -top-5 w-max text-xs font-medium text-stone-300 data-[owner=false]:left-0 data-[owner=true]:right-0 sm:text-sm"
        >
          {dateFormatted}
        </p>
      </div>
    </div>
  );
}
