import dotenv from 'dotenv';
import {prompt} from "inquirer";
import {readdirSync, readFileSync} from 'fs'
import {Presets, SingleBar} from "cli-progress";
// @ts-ignore
import {cyan, green, yellow} from 'chalk';
import matter from 'gray-matter';
import sgMail from '@sendgrid/mail'
import sgClient from '@sendgrid/client'


import {Command, flags} from '@oclif/command'
import {join} from "path";

dotenv.config();

type BlogData = {
  directory: string,
  blogFilename: string
}

export type PostItem = {
  title: string;
  description: string;
  content: string;
  slug: string;
  [key: string]: string | string[];
};

export type EmailRequest = {
  method: "POST" | "get" | "GET" | "post" | "put" | "PUT" | "patch" | "PATCH" | "delete" | "DELETE" | undefined
  url: string,
  body: any
}


const getPostSlugs = (directory:string) => {
  return readdirSync(directory)
}

export default class Campaign extends Command {
  static description = 'Send email campaigns for a new blog post'

  static examples = [
    `$ blog-notify ./.next/server/pages/
  Sending email campaign to subscribers!
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    blogFileName: flags.string({char:'n', description: 'Filename for latest blog post'}),
  }

  static args = [
    {
      name: 'directory',
      required: false,
      description: 'Directory to find the latest blog post pages',
      default: '.'
    }

  ]
  async getInteractiveArgs(filenames: string[]) {
    return prompt([
      {
        type: 'list',
        name: 'filename',
        message: 'Filename of the latest blog post to send email campaign',
        choices: filenames
      }
    ]);
  }


  async getContactEmails () {
    sgClient.setApiKey(process.env.SENDGRID_API_KEY || '')
    console.log(sgClient)
    console.log(process.env.SENDGRID_API_KEY)

    // Issue with this, is that it is a sample of recent 50 contacts.
    return await sgClient.request({
      method: 'GET',
      url: '/v3/marketing/contacts'
    })
      .then(([, body]) => {

        const contactEmails = body.result.map((contact: { email: any; }) => {
          return contact.email
        })

        console.log(contactEmails)
        return contactEmails
      }).catch((e) => console.error(e.response.body))
  }
  emailClient(postItem : PostItem, contactEmails: string[]) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

    contactEmails.forEach((email) => {
      const msg = {
        to: email, // Change to your recipient
        from: 'matthewcm64@gmail.com', // Change to your verified sender
        template_id: process.env.SENDGRID_TEMPLATE_ID || '',
        dynamic_template_data: {
          title: postItem.title,
          description: postItem.description,
          slug: postItem.slug
        }
      }

      sgMail
        // @ts-ignore
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })

    })
  }

  sleep (ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendEmail(blogData: BlogData) {

    // console.log(blogData)
    const realSlug = blogData.blogFilename.replace(/\.md$/, '')
    const filePath = join(blogData.directory, blogData.blogFilename);
    // console.log(filePath)
    const fileContents = readFileSync(filePath, 'utf8');

    const {
      data,
      content,
    } = matter(fileContents);
    const items: PostItem = {
      title: '',
      description: '',
      content: '',
      slug: '',
    };

    items.title = data.title
    items.description = data.description
    items.content = content
    items.slug = realSlug

    this.log(JSON.stringify(items, undefined, 2))


    // console.log(fileContents)

    const progressBar = new SingleBar({
      format: `Email Progress | ${yellow('{bar}')} | {percentage}% | ETA: {eta}s`,
    }, Presets.shades_classic)

    progressBar.start(2, 0)

    progressBar.increment()

    await this.sleep(2000)

    progressBar.increment()

    this.log()
    const contactEmails = await this.getContactEmails()
    this.emailClient(items, contactEmails)
    this.log()
    await this.sleep(1000)
    progressBar.stop()

    this.log()



  }

  async run() {

    const {args, flags} = this.parse(Campaign)

    const {directory} = args

    this.log(JSON.stringify(args, undefined, 2))

    const blogFilename = flags.blogFileName

    let blogData: BlogData

    if (blogFilename){
      this.log(`Searching for ${blogFilename}..`)
      this.log('Sending email campaign to subscribers!')
      blogData = {directory, blogFilename}
    }
    else {

      const filenames = getPostSlugs(directory)
        .filter((file) => file.endsWith('.md'))
        .sort()
        .reverse()

      // this.log(JSON.stringify(filenames))

      // blogData = {directory, blogFilename: ''}
      const {filename} = await this.getInteractiveArgs(filenames)

      blogData = {
        directory,
        blogFilename: filename
      }
    }


    await this.sendEmail(blogData)

    this.log(JSON.stringify(blogData))


    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}
