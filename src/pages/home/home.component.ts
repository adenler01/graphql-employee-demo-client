import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';

// We use the gql tag to parse our query string into a query document
const departmentsQry = gql`
  query Departments {
    departments {
      dept_no
      dept_name
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  departments: Array<any>;
  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: departmentsQry
    }).subscribe(({data}) => {
      this.departments = (<any>data).departments;
    });
  }

  addDepartment() {
    // this.apollo.mutate()
  }

}
