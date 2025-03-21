import { Link } from "react-router-dom";

export const Cards = () => {
  return (
    <>
      <div>
        <p>Cards</p>
        <div>
          <p>
            <Link to="/cards/sample_id">ID: sample_id</Link>
          </p>
        </div>
      </div>
    </>
  );
};
