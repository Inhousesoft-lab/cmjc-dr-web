interface SubTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SubTitleProps) {
  return (
    <div className="sub_path">
      <h2 className="tit"> {title}</h2>
    </div>
  );
}
