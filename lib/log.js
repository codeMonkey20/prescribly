import badgee from "badgee";
export default function log(...content) {
  if (process.env.NODE_ENV === "development") {
    const myBadge = badgee.define("DEV LOG", "green");
    myBadge.log(content);
  }
}
