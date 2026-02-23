import { NavLink, useParams } from "react-router-dom";

const baseClass =
  "cursor-pointer px-2 py-1 text-black/60 text-sm rounded  ";

const activeClass =
  "text-blue-600 font-semibold text-sm  border-b-2 border-blue-600";

const DocumentActionsHeader = () => {
  const { id } = useParams();

  return (
    <div className="w-full h-10 flex items-center gap-4 px-2 bg-white rounded-xl">
      <NavLink
        to=""
        end
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ""}`
        }
      >
        Content
      </NavLink>

      <NavLink
        to="chat"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ""}`
        }
      >
        AI Chat
      </NavLink>

      <NavLink
        to="actions"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ""}`
        }
      >
        AI Actions
      </NavLink>

      <NavLink
        to="flashcard"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ""}`
        }
      >
        Flashcards
      </NavLink>

      <NavLink
        to="quizzes"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ""}`
        }
      >
        Quizzes
      </NavLink>
    </div>
  );
};

export default DocumentActionsHeader;
