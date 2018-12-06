/**
 * ts-util / graph
 * @author Wang Guan <momocraft@gmail.com>
 *
 * TODO freeze API / test
 */

interface Vertice {
  /**
   * id: a string. must be uniq in the whole graph
   */
  id: string;
}

interface DirectedEdge {
  from: string;
  to: string;
}

class DirectedGraph<V extends Vertice, E extends DirectedEdge> {

  private readonly vertices: Map<string, Vertice> = new Map();
  private readonly edges: E[] = [];

  addVertice(v: V) {
    if (this.containsV(v)) {
      throw new RangeError(`Vertex of id=${v.id} already existed.`);
    }
    this.vertices.set(v.id, v);
  }

  addEdge(edge: E) {
    if (!this.containsVbyId(edge.from)) {
      throw new RangeError(`Vertex of id=${edge.from} not found`);
    } else if (!this.containsVbyId(edge.to)) {
      throw new RangeError(`Vertex of id=${edge.to} not found`);
    }
    this.edges.push(edge);
  }

  containsV(vertice: V) {
    return vertice.id in this.vertices;
  }

  edgesFrom(vertice: V) {
    return this.edges.filter(e => e.from === vertice.id);
  }

  edgesTo(vertice: V) {
    return this.edges.filter(e => e.to === vertice.id);
  }

  containsVbyId(vertexId: string) {
    return this.vertices.has(vertexId);
  }
}
