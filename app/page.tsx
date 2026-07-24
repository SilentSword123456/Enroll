import Link from "next/link";


export default function Home() {
  return(
      <div>
          <p>
              We use{" "}
              <Link href="https://www.bacplus.ro/" className="text-blue-600 underline hover:text-blue-800">Bacplus</Link>
              {" "}as our source for high-schools
          </p>
      </div>
  );
}
