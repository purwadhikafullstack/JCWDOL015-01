import Link from "next/link";
export const Header = () => {
  return (
    <div>
      <Link href={'/Subs'}><p>Subscription</p></Link>
      {/* <Link href={'/CheckSubs'}><p>Check the Subs</p></Link>
      <Link href={'/CheckSubs'}><p>Check the Subs</p></Link> */}
    </div>
  )
};
