const readline = require("readline");
const { users, publishers } = require("./schema");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 1. Users can register with their email address. No need for authentication.
const createUser = (email) => ({
  email,
  bookmarks: [],
});

// 2. Users can view all the news publishers subscribed to the portal. Assume the portal has a fixed set of
// news publishers subscribed.
const searchPublishers = (query) => {
  const results = publishers.filter(
    (publisher) =>
      publisher.name.toLowerCase().includes(query.toLowerCase()) ||
      publisher.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
      )
  );
  return results.sort((a, b) => a.name.localeCompare(b.name));
};

// Users can subscribe to a news publisher.
const subscribeToPublisher = (user, publisher) => {
  user.bookmarks.push(publisher);
  console.log(`${user.email} subscribed to ${publisher.name}`);
};

// Users can view all the news publishers they have subscribed to.
const viewSubscribedPublishers = (user) => {
  console.log("Subscribed Publishers: ");
  user.bookmarks.forEach((publisher) => {
    console.log(`${publisher.name} - Tags: ${publisher.tags.join(", ")}`);
  });
};

// Users can view all the news articles from the publishers they have subscribed to.
const viewBookmarkedNews = (user) => {
  console.log("Bookmarked News Articles: ");
  const articles = user.bookmarks.reduce(
    (acc, publisher) => acc.concat(publisher.articles),
    []
  );

  const sortedArticles = articles.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sortedArticles.forEach((article) => {
    console.log(
      `Title: ${article.title} - Description: ${article.description} - Date: ${article.date}`
    );
  });
};

// Menu for user registration.
const registrationMenu = () => {
  rl.question("Are you a new user? (yes/no): ", (response) => {
    if (response.toLowerCase() === "yes") {
      registerUser();
    } else if (response.toLowerCase() === "no") {
      //   login();
    } else {
      console.log("Invalid choice. Please enter 'yes' or 'no'.");
      registrationMenu();
    }
  });
};

// User registration function.
const registerUser = () => {
  rl.question("Enter your email address: ", (email) => {
    const newUser = createUser(email);
    users.push(newUser);
    console.log(`Registration successful! Welcome, ${newUser.email}!`);
    mainMenu(newUser);
  });
};

// Menu for subscribing to a publisher.
const subscribeMenu = (user) => {
  rl.question(
    "Enter the name or tags of the publisher you want to subscribe to: ",
    (query) => {
      const results = searchPublishers(query);
      if (results.length > 0) {
        console.log("Search results: ");
        results.forEach((publisher, index) => {
          console.log(
            `${index + 1}. ${publisher.name} - Tags: ${publisher.tags.join(
              ", "
            )}`
          );
        });

        rl.question(
          "Enter the number of the publisher you want to subscribe to: ",
          (choice) => {
            const selectedPublisher = results[parseInt(choice) - 1];
            if (selectedPublisher) {
              subscribeToPublisher(user, selectedPublisher);
            } else {
              console.log("Invalid choice");
            }
            mainMenu(user);
          }
        );
      } else {
        console.log("No results found");
        mainMenu(user);
      }
    }
  );
};

// Menu for searching publishers.
const searchPublishersMenu = (user) => {
  rl.question(
    "Enter the name or tags of the publisher you want to search for: ",
    (query) => {
      const results = searchPublishers(query);
      if (results.length > 0) {
        console.log("Search results:");
        results.forEach((publisher, index) => {
          console.log(
            `${index + 1}. ${publisher.name} - Tags: ${publisher.tags.join(
              ", "
            )}`
          );
        });
      } else {
        console.log("No results found");
      }
      mainMenu(user);
    }
  );
};

const bookmarkNewsArticle = (user) => {
  rl.question(
    "Enter the number of the news article you want to bookmark: ",
    (choice) => {
      const subscribedPublishers = user.bookmarks;
      let articles = [];

      subscribedPublishers.forEach((publisher) => {
        articles = articles.concat(publisher.articles);
      });

      const selectedArticle = articles[parseInt(choice) - 1];

      if (selectedArticle) {
        user.bookmarks.push(selectedArticle);
        console.log(
          `News article "${selectedArticle.title}" bookmarked successfully.`
        );
      } else {
        console.log("Invalid choice");
      }
      mainMenu(user);
    }
  );
};

// Main menu
const mainMenu = (user) => {
  rl.question(
    "1. Subscribe to a publisher\n2. View subscribed publishers\n3. Search publishers\n4. View bookmarked news publishers\n5. Bookmark a news article\n6. Exit\n",
    (option) => {
      switch (option) {
        case "1":
          subscribeMenu(user);
          mainMenu(user);
          break;
        case "2":
          viewSubscribedPublishers(user);
          mainMenu(user);
          break;
        case "3":
          searchPublishersMenu(user);
          mainMenu(user);
          break;
        case "4":
          viewBookmarkedNews(user);
          mainMenu(user);
          break;
        case "5":
          bookmarkNewsArticle(user);
          mainMenu(user);
          break;
        case "6":
          rl.close();
          break;
        default:
          console.log("Entered wrong option");
          mainMenu(user);
      }
    }
  );
};

registrationMenu();
