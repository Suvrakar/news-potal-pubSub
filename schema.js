// Schema for users and publishers
const users = [];
const publishers = [
  {
    id: 1,
    name: "Sports News",
    tags: ["sports", "cricket", "football"],
    articles: [
      {
        id: 1,
        title: "Exciting cricket mathc",
        description: "helooo today an extciting match have been held",
        date: new Date("2023-11-15"),
      },
      {
        id: 2,
        title: "Bangladesh won the world cup",
        description: "Today Bd own the cricket world cup in the history",
        date: new Date("2023-11-14"),
      },
    ],
  },
  {
    id: 2,
    name: "Politics Daily",
    tags: ["politics", "world"],
    articles: [
      {
        id: 1,
        title: "Government Announcement",
        description: "The government made a significant announcement ",
        date: new Date("2023-11-15"),
      },
      {
        id: 2,
        title: "Election Results",
        description:
          "The election results for the latest election were declared.",
        date: new Date("2023-11-15"),
      },
    ],
  },
];

module.exports = {
  users,
  publishers,
};
