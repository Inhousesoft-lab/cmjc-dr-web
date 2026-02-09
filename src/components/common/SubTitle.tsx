interface SubTitleProps {
  title: string;
}

export default function SubTitle({ title }: SubTitleProps) {
  return (
    <div className="sub_title">
      <h2 className="tit"> {title}</h2>
    </div>
  );
}
