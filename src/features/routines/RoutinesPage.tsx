import { Link } from 'react-router-dom';
import { useRoutineDispatch, useRoutines } from './RoutineContext';
import { RoutineCreateForm } from './RoutineCreateForm';
import { Icon } from '../../components/Icon';

export default function RoutinesPage() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  return <>
    <div className="page-heading"><p className="eyebrow">TẬP LUYỆN THEO CÁCH CỦA BẠN</p><h1>Giáo án của bạn</h1><p>Sắp xếp bài tập thành những buổi tập có chủ đích.<br />Mọi kế hoạch lớn đều bắt đầu từ một bước nhỏ.</p></div>
    <RoutineCreateForm />
    <div className="section-heading routine-section-heading"><h2>Danh sách giáo án<span className="count-pill">{routines.length}</span></h2><span className="section-note">Chọn bài từ kho để thêm vào giáo án</span></div>
    {routines.length ? <div className="routine-grid">{routines.map((routine, index) => <article className="routine-card" key={routine.id}><div className="routine-card-top"><span className="feature-icon"><Icon name="list" size={22} /></span><span className="routine-index">GIÁO ÁN {String(index + 1).padStart(2, '0')}</span><button className="icon-button delete-button" aria-label={`Xóa ${routine.name}`} onClick={() => dispatch({ type: 'remove', payload: { id: routine.id } })}><Icon name="trash" size={16} /></button></div><h3><Link to={`/routines/${encodeURIComponent(routine.id)}`}>{routine.name}</Link></h3><p>{routine.exerciseIds.length} bài</p><Link className="routine-card-link" to={`/routines/${encodeURIComponent(routine.id)}`} aria-label={`Xem giáo án ${routine.name}`}>Xem giáo án<Icon name="arrow" size={17} /></Link></article>)}</div> : <section className="library-panel empty-state"><Icon name="list" size={34} /><h3>Giáo án đầu tiên đang chờ bạn</h3><p>Đặt tên cho giáo án ở trên, rồi thêm bài từ kho bài tập.</p></section>}
  </>;
}
