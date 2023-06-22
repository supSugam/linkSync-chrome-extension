enum TimeType {
    Morning = 'morning',
    Afternoon = 'afternoon',
    Evening = 'evening',
    Night = 'night'
  }
  
const getGreetings = (name:string|undefined):string => {
    const currentHour = new Date().getHours();
  
    let timeType: TimeType;
  
    if (currentHour >= 5 && currentHour < 12) {
      timeType = TimeType.Morning;
    } else if (currentHour >= 12 && currentHour < 17) {
      timeType = TimeType.Afternoon;
    } else if (currentHour >= 17 && currentHour < 20) {
      timeType = TimeType.Evening;
    } else {
      timeType = TimeType.Night;
    }
  
    let greeting: string;
  
    switch (timeType) {
      case TimeType.Morning:
        greeting = `Have a Great Day Ahead, ${name}! 🌞`;
        break;
      case TimeType.Afternoon:
        greeting = `Sit Straight, Do your Work, and Stay Hydrated, ${name} 💧`;
        break;
      case TimeType.Evening:
        greeting = `Hope you had a Good Day, ${name}! 😇`;
        break;
      case TimeType.Night:
        greeting = `Don't Overwork Yourself, and Have a Good Night, ${name}! 🌃💤`;
        break;
      default:
        greeting = 'Hello!';
        break;
    }
  
    return greeting;
  }
  
export default getGreetings;
  