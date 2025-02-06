import { Component, OnInit, OnDestroy } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {Subscription} from 'rxjs';

type BlogsResult = {
  blogs: {
    id:string,
    title:string
  }[]
}

// We use the gql tag to parse our query string into a query document
const BlogsQuery = gql<BlogsResult,any>`
  query  {
    blogs {
      title
      id
    }
  }
`;

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    standalone: false
})
export class BlogComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  blogPosts?: {title:string, id:string}[];
  blogPost?: {title:string, content:string};
  blogTitle:string = '';

  private querySubscription: Subscription = new Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery({
      query: BlogsQuery,
    })
        .valueChanges
        .subscribe(({data, loading}) => {
          this.loading = loading;
          this.blogPosts = data.blogs;
        });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
