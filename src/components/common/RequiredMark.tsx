interface RequiredMarkProps {
  label?: string;
}

export default function RequiredMark({
  label = "필수입력",
}: RequiredMarkProps) {
  return <span className="ico_necessary">{label}</span>;
}
