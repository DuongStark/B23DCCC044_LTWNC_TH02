import { Link } from "react-router-dom";
import { useRoutineDispatch, useRoutines } from "./RoutineContext";
import { RoutineCreateForm } from "./RoutineCreateForm";
import { Icon } from "../../components/Icon";
import { notify } from "../feedback/useToastStore";

export default function RoutinesPage() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  return (
    <>
      <div className="page-heading">
        <h1>Giáo án của bạn</h1>
      </div>
      <RoutineCreateForm />
      <div className="section-heading routine-section-heading">
        <h2>
          Danh sách giáo án<span className="count-pill">{routines.length}</span>
        </h2>
      </div>
      {routines.length ? (
        <div className="routine-grid">
          {routines.map((routine) => (
            <article className="routine-card" key={routine.id}>
              <div className="routine-card-top">
                <h3>
                  <Link to={`/routines/${encodeURIComponent(routine.id)}`}>{routine.name}</Link>
                </h3>
                <button
                  className="icon-button delete-button"
                  aria-label={`Xóa ${routine.name}`}
                  onClick={() => {
                    dispatch({ type: "remove", payload: { id: routine.id } });
                    notify(`Đã xóa giáo án “${routine.name}”.`);
                  }}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
              <p>{routine.exerciseIds.length} bài</p>
              <Link
                className="routine-card-link"
                to={`/routines/${encodeURIComponent(routine.id)}`}
                aria-label={`Xem giáo án ${routine.name}`}
              >
                Xem giáo án
                <Icon name="arrow" size={17} />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <section className="library-panel empty-state">
          <Icon name="list" size={34} />
          <h3>Giáo án đầu tiên đang chờ bạn</h3>
        </section>
      )}
    </>
  );
}
