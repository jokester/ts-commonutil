#!/usr/bin/env ruby
require 'pathname'
require 'json'
require 'pp'

here = Pathname.new(__dir__)

src_dir = here / 'src'

tsx_files = src_dir
  .find
  .select{|fn| fn.file? and fn.to_s =~ /\.tsx?$/i }
  .reject{|fn| fn.to_s =~ /\.spec\./ }

exports = Hash[
  tsx_files
  .sort
  .map do |e|
    relative_path = e.relative_path_from(src_dir)
    relative_path_wo_ext = relative_path.sub(/\.[tj]sx?$/i, '').to_s
    js_ext = if relative_path.fnmatch? '*.tsx' then 'jsx' else 'js' end

    [
      "./lib/#{relative_path_wo_ext}",
      {
        import: "./lib/__esm/#{relative_path_wo_ext}.#{js_ext}",
        require: "./lib/#{relative_path_wo_ext}.#{js_ext}",
        type: "./lib/#{relative_path_wo_ext}.d.ts"
      }
    ]
  end
]

pkg_json = here / 'package.json'

v = JSON.parse(pkg_json.read, symbolize_names: true)

pkg_json.write JSON.pretty_generate(**v, exports: exports)
