import 'package:flame/experimental.dart';
import 'package:flame/extensions.dart';
import 'package:flame/geometry.dart';

// TODO(luan): optmize, test, and move this to Flame

const _epsilon = 10e-9;

bool isSameLine(LineSegment a, LineSegment b, {double epsilon = _epsilon}) {
  return (isSameVector(a.from, b.from, epsilon: epsilon) &&
          isSameVector(a.to, b.to, epsilon: epsilon)) ||
      (isSameVector(a.from, b.to, epsilon: epsilon) &&
          isSameVector(a.to, b.from, epsilon: epsilon));
}

bool isSameVector(Vector2 v1, Vector2 v2, {double epsilon = _epsilon}) {
  return v1.distanceToSquared(v2) < epsilon;
}

Vector2 lineMidPoint(LineSegment line) {
  return line.from + (line.to - line.from) / 2;
}

extension RectExtension on Rect {
  Rectangle toFlameRectangle() => Rectangle.fromLTRB(left, top, width, height);
}

// ignore: non_constant_identifier_names
Rectangle Rectangle_fromCenter({
  required Vector2 center,
  required Vector2 size,
}) {
  final halfSize = size / 2;
  return Rectangle.fromPoints(
    center - halfSize,
    center + halfSize,
  );
}

extension RectangleExtension on Rectangle {
  Rect toRect() => Rect.fromLTWH(left, top, width, height);

  List<Vector2> intersections(LineSegment line) {
    return edges.expand((e) => e.intersections(line)).toList();
  }

  List<LineSegment> get edges => [topEdge, rightEdge, bottomEdge, leftEdge];

  LineSegment get topEdge => LineSegment(topLeft, topRight);
  LineSegment get rightEdge => LineSegment(topRight, bottomRight);
  LineSegment get bottomEdge => LineSegment(bottomRight, bottomLeft);
  LineSegment get leftEdge => LineSegment(bottomLeft, topLeft);

  List<Vector2> get vertices => [topLeft, topRight, bottomRight, bottomLeft];

  Vector2 get topLeft => Vector2(left, top);
  Vector2 get topRight => Vector2(right, top);
  Vector2 get bottomRight => Vector2(right, bottom);
  Vector2 get bottomLeft => Vector2(left, bottom);
}
