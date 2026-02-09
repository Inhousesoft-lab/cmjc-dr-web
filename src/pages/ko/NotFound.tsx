import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page notfound">
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p><Link to="/">홈으로 이동</Link></p>
    </div>
  )
}
