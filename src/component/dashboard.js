const Dashboard = () => {
  const cardList = [
    {
      title: "Impact Holding Company Bots",
      cards: [
        {
          name: "Sagae president",
          text: "This is president bot",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
      ],
    },
    {
      title: "Company Bots",
      cards: [
        {
          name: "Speech to text Bot",
          text: "This is speech to text bot.",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "Customer suppoter bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "Customer suppoter botl",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
      ],
    },
    {
      title: "Development group",
      cards: [
        {
          name: "Programming bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New porject bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
      ],
    },
    {
      title: "Sale group",
      cards: [
        {
          name: "New income bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New outcome bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New income bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New outcome bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New income bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New outcome bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New income bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New outcome bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New income bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
        {
          name: "New outcome bot",
          text: "This is the customer supporter bot for new system",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
      ],
    },
    {
      title: "Private",
      cards: [
        {
          name: "Learn for sale",
          text: "This is my private learingi bot",
          imageUrl:
            "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
        },
      ],
    },
  ];
  return (
    <>
{cardList.map((cl) => (
  <div
    key={cl.title}
    className="text-base font-semibold leading-6 text-white-900 my-5"
  >
    {cl.title}

    <div
      className="clearfix"
      style={{ justifyContent: "space-between" }}
    >
      {cl.cards.map((card, index) => (
         <div
         key={index}
         className="flex items-center custom-card mb-4 float-left mt-3"
         style={{ flex: "1 1 0", minWidth: "0", marginRight: "15px" }}
       >
         <img
           className="h-12 w-12 flex-none rounded-full bg-gray-50"
           src={card.imageUrl}
           alt=""
         />
         <div className="min-w-0 ml-3">
           <p className="text-sm font-semibold leading-6 text-white-900">
             {card.name}
           </p>
           <p className="text-xs font-semibold leading-6">
             {card.text}
           </p>
         </div>
         </div>
      ))}
    </div>
  </div>
))}




</>

  );
};

export default Dashboard;
