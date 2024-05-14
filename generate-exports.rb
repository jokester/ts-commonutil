#!/usr/bin/env ruby
require 'pathname'
require 'json'
require 'pp'

@here = Pathname.new(__dir__)

def build_exports
  src_dir = @here / 'src'

  ts_files = src_dir
    .find
    .select{|fn| fn.file? and fn.to_s =~ /\.tsx?$/i }
    .reject{|fn| fn.to_s =~ /\.spec\./ }

  Hash[
    ts_files
    .sort
    .map do |e|
      relative_path = e.relative_path_from(src_dir)
      relative_path_wo_ext = relative_path.sub(/\.[tj]sx?$/i, '').to_s
      orig_ext = relative_path.extname.slice(1, 1e9)
      js_ext = if relative_path.fnmatch? '*.tsx' then 'jsx' else 'js' end

      import_entry, import_spec = yield relative_path_wo_ext, js_ext, orig_ext
      [import_entry, import_spec]
    end
  ]
end

def rewrite_json json_path
  v = JSON.parse(json_path.read, symbolize_names: true)
  json_path.write JSON.pretty_generate(yield v)
end

def rewrite_pkg_json
  pkg_json = @here / 'package.json'
  exports = build_exports do |relative_path_wo_ext, js_ext|
    ["./lib/#{relative_path_wo_ext}",
     {
       import: "./lib/__esm/#{relative_path_wo_ext}.#{js_ext}",
       require: "./lib/#{relative_path_wo_ext}.#{js_ext}",
       type: "./lib/#{relative_path_wo_ext}.d.ts"
     }
    ]
  end
  rewrite_json pkg_json do |v|
    {**v, exports: exports}
  end
end

def rewrite_jsr_json
  jsr_json = @here / 'jsr.json'
  exports = build_exports do |relative_path_wo_ext, js_ext, orig_ext|
    [
      "./#{relative_path_wo_ext}",
      "./src/#{relative_path_wo_ext}.#{orig_ext}",
    ]
  end
  rewrite_json jsr_json do |v|
    {**v, exports: exports}
  end
end

rewrite_pkg_json
rewrite_jsr_json
