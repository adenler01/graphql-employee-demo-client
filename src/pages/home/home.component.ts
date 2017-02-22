import { Department } from './../../shared/models/department.model';
import { Component, OnInit } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
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

const departmentAddQry = gql`
  mutation ($dept: DepartmentInput!) {
    insertUpdateDepartment (department: $dept) {
      dept_no
      dept_name
    }
  }
`;

const departmentDelQry = gql`
  mutation ($dept_no: String!) {
    deleteDepartment (dept_no: $dept_no)
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  query: ApolloQueryObservable<any>;

  departments: Array<any>;
  dept_no = '';
  dept_name = '';

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.query = this.apollo.watchQuery<Array<Department>>({
      query: departmentsQry
    });

    this.query.subscribe(resp => {
      let data: Array<Department> = [].concat((<any>resp.data).departments);

      data = data.sort((a, b) => {
        if (a.dept_name < b.dept_name) {
          return -1;
        } else if (a.dept_name > b.dept_name) {
          return 1;
        } else {
          return 0;
        }
      });

      this.departments = data;
    });
  }

  deleteDepartment(department) {
    this.apollo.mutate({
      mutation: departmentDelQry,
      variables: {
        dept_no: department.dept_no
      },
      updateQueries: {
        Departments: (prev, {mutationResult}: any) => {
          const x: Array<Department> = (<any>prev).departments;
          const idx = x.findIndex(o => o.dept_no === department.dept_no);

          if (idx > -1) {
            x.splice(idx, 1);
          }

          return {
            departments: [...x]
          };
        }
      }
    }).subscribe(
      ({ data }) => {
      }, (err) => {
        console.log('there was an error sending the query', err);
      });

  }

  addDepartment() {
    if (this.dept_no && this.dept_name) {
      this.apollo.mutate({
        mutation: departmentAddQry,
        variables: {
          dept: {
            dept_no: this.dept_no,
            dept_name: this.dept_name
          }
        },
        updateQueries: {
          Departments: (prev, {mutationResult}: any) => {

            return {
              departments: [mutationResult.data.insertUpdateDepartment, ...(<any>prev).departments]
            };
          }
        }
      }).subscribe(
        ({ data }) => {
        }, (err) => {
          console.log('there was an error sending the query', err);
        });

    }
  }

  editDepartment(dept) {

  }
}
