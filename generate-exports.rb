#!/usr/bin/env ruby
require 'pathname'
require 'json'
require 'pp'

here = Pathname.new(__dir__)

src_dir = here / 'src'

entries = src_dir
  .find
  .select{|fn| fn.file? and fn.to_s =~ /\.tsx?$/i }
  .reject{|fn| fn.to_s =~ /\.spec\./ }

exports = Hash[
  entries
  .sort
  .map do |e|
    r = e.relative_path_from(src_dir).sub(/\.[tj]sx?$/i, '').to_s
    [ "./lib/#{r}",
      { import: "./lib/__esm/#{r}", require: "./lib/#{r}" }
    ]
  end
]

pkg_json = here / 'package.json'

v = JSON.parse(pkg_json.read, symbolize_names: true)

pkg_json.write JSON.pretty_generate(**v, exports: exports)
