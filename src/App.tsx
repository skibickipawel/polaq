import * as cheerio from 'cheerio';
import * as React from 'react';
// import * as request from 'request';

interface IState {
  messages: string[];
}

const CURR_ELEMENT_COUNT = 7;

class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      messages: [] as string[],
    };

    this.processResponse = this.processResponse.bind(this);
    this.checkForNewAwardsRequest = this.checkForNewAwardsRequest.bind(this);
  }

  public async componentDidMount() {
    // await this.checkForNewAwardsRequest();
    // setInterval(this.checkForNewAwardsRequest, 3 * 1000);
  }

  public async checkForNewAwardsRequest() {
    // return await request('https://polakpotrafi.pl/projekt/auto-stop-race-2019/', this.processResponse);
    return fetch('https://polakpotrafi.pl/projekt/auto-stop-race-2019/', {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'plain/text'
      }
    }).then((response: any) => {
      const newMessages = this.state.messages;

      const $ = cheerio.load(response.body);
      const selectors = ['.card.clearfix'];
      selectors.forEach(selector => {
        if ($(selector).length > CURR_ELEMENT_COUNT) {
          newMessages.push('NEW AWARD!!!');
        } else {
          newMessages.push(':(');
        }
      });

      this.setState({ messages: newMessages });
    }).catch((err: any) => {
      const newMessages = this.state.messages;
      newMessages.push('Błąd!');
      this.setState({ messages: newMessages });
    });
  }

  public processResponse(err: any, resp: any, html: any) {
    const newMessages = this.state.messages;
    if (!err) {
      const $ = cheerio.load(html);
      const selectors = ['.card.clearfix'];
      selectors.forEach(selector => {
        if ($(selector).length > CURR_ELEMENT_COUNT) {
          newMessages.push('NEW AWARD!!!');
        } else {
          newMessages.push(':(');
        }
      });
    } else {
      newMessages.push('Błąd!');
    }
    this.setState({ messages: newMessages });
  }

  public render() {
    const { messages } = this.state;
    return (
      <React.Fragment>
        {messages.map((message: string, i: any) => {
          return (
            <div key={i}>
              <p>{message}</p>
            </div>);
        })}
      </React.Fragment>
    );
  }
}

export default App;
