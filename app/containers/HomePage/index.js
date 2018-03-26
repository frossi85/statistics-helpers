/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import H2 from 'components/H2';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import styled from 'styled-components';
import getNormalDistribution from 'get-normal-distribution';
import distributions from 'distributions';

const Label = styled.label`
  margin-right: 10px;
`;

const Button = styled.input`
  margin: 30px;
  border: 1px solid black;
`;

let normal = distributions.Normal();

export class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function


  constructor(props, context) {
    super(props, context);

    this.state = {
      tamanioMuestra: 0,
      media: 0,
      desviacionEstandar: 0,
      above: 0,
      below: 0,
      betweenFrom: 0,
      betweenTo: 0,
      selectedProblem: 'Above',
      result: 0,
      parametroP: null,
    };
  }

  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
  }

  submitForm = (evt) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    console.log(this.state.tamanioMuestra);
    this.solveMeanEstimationProblem();
  };

  onTamanioMuentraChange = (e) => {
    this.setState({
      tamanioMuestra: e.target.value,
    });
    this.solveMeanEstimationProblem();
  };

  onMediaChange = (e) => {
    this.setState({
      media: e.target.value,
    });
    this.solveMeanEstimationProblem();
  };

  onDesviacionEstandar = (e) => {
    this.setState({
      desviacionEstandar: e.target.value,
    });
    this.solveMeanEstimationProblem();
  };

  onParametroP = (e) => {
    if (e.target.value !== null || e.target.value !== '') {
      const p = e.target.value;
      const d = Math.sqrt((p * (1 - p)) / this.state.tamanioMuestra);

      this.setState({
        desviacionEstandar: (Math.round(d * 10000) / 10000).toFixed(4),
        media: p,
      });
    } else {
      this.setState({
        desviacionEstandar: 0,
        media: 0,
      });
    }

    this.setState({
      parametroP: e.target.value,
    });
    this.solveMeanEstimationProblem();
  };

  onAboveChange = (e) => {
    this.setState({
      above: e.target.value,
      below: 0,
      betweenFrom: 0,
      betweenTo: 0,
    });
    this.solveMeanEstimationProblem();
  };

  onBelowChange = (e) => {
    this.setState({
      above: 0,
      below: e.target.value,
      betweenFrom: 0,
      betweenTo: 0,
    });
    this.solveMeanEstimationProblem();
  };

  onBetweenFromChange = (e) => {
    this.setState({
      above: 0,
      below: 0,
      betweenFrom: e.target.value,
    });
    this.solveMeanEstimationProblem();
  };

  onBetweenToChange = (e) => {
    this.setState({
      above: 0,
      below: 0,
      betweenTo: e.target.value,
    });
    this.solveMeanEstimationProblem();
  };

  handleOptionChange = (changeEvent) => {
    console.log(changeEvent.target.value);

    this.setState({
      selectedProblem: changeEvent.target.value,
    });

    this.solveMeanEstimationProblem();
  }

  solveMeanEstimationProblem() {
    let u;
    let d;

    if (this.state.parametroP !== null && this.state.parametroP !== '') {
      u = this.state.parametroP;
      d = Math.sqrt((u * (1 - u)) / this.state.tamanioMuestra);
      d = (Math.round(d * 10000) / 10000).toFixed(4);
    } else {
      u = this.state.media;
      d = this.state.desviacionEstandar / Math.sqrt(this.state.tamanioMuestra);
      d = (Math.round(d * 10000) / 10000).toFixed(4);
    }

    let x;
    let z;
    let Pz;
    let xFrom;
    let xTo;
    let zFrom;
    let zTo;
    let Pz1;
    let Pz2;

    switch (this.state.selectedProblem) {
      case 'Above':
        x = this.state.above;
        z = (x - u) / d;
        Pz = this.calcArea(Math.abs(z), 0, 1);

        if (z >= 0) {
          this.setState({ result: (0.5000 - Pz) });
        } else {
          this.setState({ result: (0.5000 + Pz) });
        }
        break;
      case 'Below':
        x = this.state.below;
        z = (x - u) / d;
        Pz = this.calcArea(Math.abs(z), 0, 1);

        if (z >= 0) {
          this.setState({ result: (0.5000 + Pz) });
        } else {
          this.setState({ result: (0.5000 - Pz) });
        }
        break;
      case 'Between':
        xFrom = this.state.betweenFrom;
        xTo = this.state.betweenTo;
        zFrom = (xFrom - u) / d;
        zTo = (xTo - u) / d;

        if (zFrom < 0 && zTo === 0) {
          Pz = this.calcArea(Math.abs(zFrom), 0, 1);
          this.setState({ result: Pz });
        }

        if (zFrom < 0 && zTo < 0) {
          Pz1 = this.calcArea(Math.abs(zFrom), 0, 1);
          Pz2 = this.calcArea(Math.abs(zTo), 0, 1);
          this.setState({ result: (Pz1 - Pz2) });
        }

        if (zFrom < 0 && zTo > 0) {
          Pz1 = this.calcArea(Math.abs(zFrom), 0, 1);
          Pz2 = this.calcArea(Math.abs(zTo), 0, 1);
          this.setState({ result: (Pz1 + Pz2) });
        }

        if (zFrom === 0 && zTo > 0) {
          Pz = this.calcArea(Math.abs(zTo), 0, 1);
          this.setState({ result: Pz });
        }

        if (zFrom > 0 && zTo > 0) {
          Pz1 = this.calcArea(Math.abs(zFrom), 0, 1);
          Pz2 = this.calcArea(Math.abs(zTo), 0, 1);
          this.setState({ result: (Pz2 - Pz1) });
        }
        break;
      default:
        break;
    };
    console.log('Recalculating!!!');
  }

  calcArea(z0) {
    const area = normal.cdf(Math.abs(z0)) - 0.5000;
    return parseFloat((Math.round(area * 10000) / 10000).toFixed(4));
  }

  render() {
    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <div>
          <Section>
            <H2>
              Distribución muestral de la media muestral y de muestreo de la proporción de muestra (p)
            </H2>
            <Form onSubmit={this.submitForm}>
              <Label>
                Tamaño de la muestra
              </Label>
              <Input
                type="text"
                value={this.state.tamanioMuestra}
                onChange={this.onTamanioMuentraChange}
              />
              <br />

              <Label>
                Media
              </Label>
              <Input
                type="text"
                value={this.state.media}
                onChange={this.onMediaChange}
              />
              <br />

              <Label>
                Desviación estándar
              </Label>
              <Input
                type="text"
                value={this.state.desviacionEstandar}
                onChange={this.onDesviacionEstandar}
              />
              <br />

              <Label>
                Parametro P (proporción)
              </Label>
              <Input
                type="text"
                value={this.state.parametroP}
                onChange={this.onParametroP}
              />
              <br />

              <Input
                type="radio"
                checked={this.state.selectedProblem === 'Above'}
                onChange={this.handleOptionChange}
                value="Above"
              />
              <Label>
                Above
              </Label>
              <Input
                type="text"
                value={this.state.above}
                onChange={this.onAboveChange}
              />
              <br />

              <Input
                type="radio"
                checked={this.state.selectedProblem === 'Below'}
                onChange={this.handleOptionChange}
                value="Below"
              />
              <Label>
                Below
              </Label>
              <Input
                type="text"
                value={this.state.below}
                onChange={this.onBelowChange}
              />
              <br />

              <Input
                type="radio"
                checked={this.state.selectedProblem === 'Between'}
                onChange={this.handleOptionChange}
                value="Between"
              />
              <Label>
                Between
              </Label>
              <Input
                type="text"
                value={this.state.betweenFrom}
                onChange={this.onBetweenFromChange}
              />
              <span> to </span>
              <Input
                type="text"
                value={this.state.betweenTo}
                onChange={this.onBetweenToChange}
              />
              <br />
              <Button type="submit" />
            </Form>
            <div>
              <Label>Result(dos decimales): {(Math.round(this.state.result * 10000) / 10000).toFixed(2)}</Label>
              <Label>Result(tres decimales): {(Math.round(this.state.result * 10000) / 10000).toFixed(3)}</Label>
              <Label>Result(cuatro decimales): {(Math.round(this.state.result * 10000) / 10000).toFixed(4)}</Label>
            </div>
          </Section>
        </div>
      </article>
    );
  }
}

export default HomePage;
