

(function() {
  console.log('llll')
  const quotes = [
    {
      text: "“Once you replace negative thoughts with positive ones, you’ll start having positive results.” - Willie Nelson, Musician",
    },
    {
      text: "“In every day, there are 1,440 minutes. That means we have 1,440 daily opportunities to make a positive impact.” - Les Brown, Author",
    },
    {
      text: "“Positive anything is better than negative nothing.” - Elbert Hubbard, Writer",
    },
    {
      text: "“Virtually nothing is impossible in this world if you just put your mind to it and maintain a positive attitude.” - Lou Holtz, Former Football Player",
    },
    {
      text: "“The sun himself is weak when he first rises, and gathers strength and courage as the day gets on.” - Charles Dickens, Author",
    },
    {
      text: "“Fånga dagen din jävel“ - Okänd frontend wannabe",
    },
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.querySelector(".quote").innerHTML =
    '<p>' + quote.text + '</p>';
})();