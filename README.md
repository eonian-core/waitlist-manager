# WaitList Manager

Serverless application manages access to our wait list and gives access to users at specific intervals

## Getting Started

Clone repo

```bash
git clone https://github.com/eonian-core/waitlist-manager.git
```

Install dependencies

```bash
  cd waitlist-manager
  yarn
```
    
## Development

Build and start server

```bash
  yarn dev
```

### Commands 

- `build` - Build project
- `start` - Start server



### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`


### Running Tests

To run tests, run the following command

```bash
  yarn test
```


### Deployment

To deploy, you need [install flyctl](https://fly.io/docs/hands-on/install-flyctl/) and login using `fly auth login`

To deploy this project run

```bash
  yarn deploy
```

#### Next steps

- Run `fly status` - show the status of the application instances.
- Run `fly apps open` - open your browser and direct it to your app.


## Made by Eonian

[Eonian](https://www.github.com/octokatherine) internal project. We trying to be as transparent as possible with our users, as part of this practice we publishing this project.
You can also use it for own development. Any contributions and suggestions are welcome! 


## Contributing

Contributions are always welcome!

Create new issues or contact us in [Discord](https://discord.gg/8mcUPPYJmj) for any questions!



## License

[GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/)

