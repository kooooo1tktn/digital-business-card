import { Link } from "react-router-dom";

export const Cards = () => {
  return (
    <>
      <div>
        <p>Cards</p>
        <div>
          <p>
            <Link to="/cards/sample-id">ID: sample-id</Link>
          </p>
          <p>
            <Link to="/cards/register">登録画面</Link>
          </p>
        </div>
      </div>
    </>
  );
};
